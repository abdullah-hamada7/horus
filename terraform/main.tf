# Custom VPC
resource "aws_vpc" "this" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "museum-vpc"
  }
}

# Internet Gateway for public subnet internet access
resource "aws_internet_gateway" "this" {
  vpc_id = aws_vpc.this.id

  tags = {
    Name = "museum-igw"
  }
}

# Public Subnet for the EC2 server
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.this.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "${var.aws_region}a"

  tags = {
    Name = "museum-public-subnet"
  }
}

# Public Route Table
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.this.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.this.id
  }

  tags = {
    Name = "museum-public-route-table"
  }
}

# Route Table Association
resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

# Security Group for Application and SSH
resource "aws_security_group" "app_sg" {
  name        = "museum-app-security-group"
  description = "Allow inbound SSH and HTTP traffic"
  vpc_id      = aws_vpc.this.id

  # Allow HTTP (web traffic)
  ingress {
    description = "Allow public HTTP traffic"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow SSH (admin management access)
  ingress {
    description = "Allow SSH traffic"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # For testing/ease of use, can restrict to your IP
  }

  # Outbound rules (allows speaking to Supabase, pulling Docker images, packages, etc.)
  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = {
    Name = "museum-app-sg"
  }
}

# Query the latest Ubuntu 22.04 LTS AMI in the current region
data "aws_ami" "ubuntu" {
  most_recent = true
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
  owners = ["099720109477"] # Canonical
}

# EC2 Instance to run the museum application stack
resource "aws_instance" "app_server" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  key_name               = var.key_name
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.app_sg.id]

  user_data = file("${path.module}/user_data.sh")

  root_block_device {
    volume_size           = 15
    volume_type           = "gp3"
    delete_on_termination = true
  }

  tags = {
    Name = "egyptian-museum-server"
  }
}

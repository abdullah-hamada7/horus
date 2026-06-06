from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
from dotenv import load_dotenv

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

app = Flask(__name__)
CORS(app)

# Database Configuration
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

DATABASE_URL = os.environ.get('DATABASE_URL') or os.environ.get('SUPABASE_DB_URL')
if DATABASE_URL:
    # Supabase/PostgreSQL URL configuration
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(BASE_DIR, 'museum.db')

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = os.path.join(BASE_DIR, 'uploads')

db = SQLAlchemy(app)

# Ensure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# --- MODELS ---
class Era(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    years = db.Column(db.String(100))
    kings = db.relationship('King', backref='era_ref', lazy=True)

class King(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    englishName = db.Column(db.String(100))
    dynasty = db.Column(db.String(100))
    reign = db.Column(db.String(100))
    bio = db.Column(db.Text)
    achievements = db.Column(db.Text)
    cartouche = db.Column(db.String(100))
    image = db.Column(db.String(255))
    docId = db.Column(db.String(50))
    era_id = db.Column(db.Integer, db.ForeignKey('era.id'))

# --- ROUTES ---

@app.route('/api')
def api_root():
    return jsonify({
        "message": "Welcome to the Royal Archive API",
        "version": "1.0.0",
        "endpoints": [
            "/api/eras",
            "/api/kings",
            "/api/uploads"
        ]
    })

@app.route('/api/swagger.json')
def swagger_spec():
    era_params = [
        {"name": "name", "in": "body", "schema": {"type": "object", "properties": {"name": {"type": "string"}, "years": {"type": "string"}}}}
    ]
    king_params = [
        {"name": "name", "in": "formData", "type": "string", "required": True},
        {"name": "englishName", "in": "formData", "type": "string"},
        {"name": "dynasty", "in": "formData", "type": "string"},
        {"name": "reign", "in": "formData", "type": "string"},
        {"name": "bio", "in": "formData", "type": "string"},
        {"name": "achievements", "in": "formData", "type": "string", "description": "Newline separated"},
        {"name": "cartouche", "in": "formData", "type": "string"},
        {"name": "docId", "in": "formData", "type": "string"},
        {"name": "era_id", "in": "formData", "type": "integer"},
        {"name": "image", "in": "formData", "type": "file"}
    ]

    return jsonify({
        "swagger": "2.0",
        "info": {"title": "Royal Archive API", "version": "1.0.0"},
        "basePath": "/api",
        "paths": {
            "/eras": {
                "get": {"tags": ["Eras"], "responses": {"200": {"description": "OK"}}},
                "post": {"tags": ["Eras"], "parameters": era_params, "responses": {"201": {"description": "Created"}}}
            },
            "/eras/{id}": {
                "get": {"tags": ["Eras"], "parameters": [{"name": "id", "in": "path", "type": "integer", "required": True}], "responses": {"200": {"description": "OK"}}},
                "put": {"tags": ["Eras"], "parameters": [{"name": "id", "in": "path", "type": "integer", "required": True}] + era_params, "responses": {"200": {"description": "Updated"}}},
                "delete": {"tags": ["Eras"], "parameters": [{"name": "id", "in": "path", "type": "integer", "required": True}], "responses": {"204": {"description": "Deleted"}}}
            },
            "/kings": {
                "get": {"tags": ["Kings"], "responses": {"200": {"description": "OK"}}},
                "post": {"tags": ["Kings"], "parameters": king_params, "responses": {"201": {"description": "Created"}}}
            },
            "/kings/{id}": {
                "get": {"tags": ["Kings"], "parameters": [{"name": "id", "in": "path", "type": "integer", "required": True}], "responses": {"200": {"description": "OK"}}},
                "put": {"tags": ["Kings"], "parameters": [{"name": "id", "in": "path", "type": "integer", "required": True}] + king_params, "responses": {"200": {"description": "Updated"}}},
                "delete": {"tags": ["Kings"], "parameters": [{"name": "id", "in": "path", "type": "integer", "required": True}], "responses": {"204": {"description": "Deleted"}}}
            }
        }
    })

@app.route('/api/eras', methods=['GET', 'POST'])
def handle_eras():
    if request.method == 'POST':
        data = request.json
        new_era = Era(name=data['name'], years=data.get('years'))
        db.session.add(new_era)
        db.session.commit()
        return jsonify({"id": new_era.id, "name": new_era.name}), 201
    
    eras = Era.query.all()
    return jsonify([{"id": e.id, "name": e.name, "years": e.years} for e in eras])

@app.route('/api/eras/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def handle_single_era(id):
    era = Era.query.get_or_404(id)
    
    if request.method == 'GET':
        return jsonify({"id": era.id, "name": era.name, "years": era.years})
        
    if request.method == 'PUT':
        data = request.json
        if 'name' in data: era.name = data['name']
        if 'years' in data: era.years = data['years']
        db.session.commit()
        return jsonify({"message": "Era updated successfully"})
        
    if request.method == 'DELETE':
        if len(era.kings) > 0:
            return jsonify({"error": "Cannot delete era with linked kings"}), 400
        db.session.delete(era)
        db.session.commit()
        return '', 204

@app.route('/api/kings', methods=['GET', 'POST'])
def handle_kings():
    if request.method == 'POST':
        data = request.form
        image_file = request.files.get('image')
        filename = ""
        
        if image_file:
            filename = secure_filename(image_file.filename)
            image_file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        
        new_king = King(
            name=data['name'],
            englishName=data.get('englishName'),
            dynasty=data.get('dynasty'),
            reign=data.get('reign'),
            bio=data.get('bio'),
            achievements=data.get('achievements'),
            cartouche=data.get('cartouche'),
            docId=data.get('docId'),
            era_id=data.get('era_id'),
            image=filename
        )
        db.session.add(new_king)
        db.session.commit()
        return jsonify({"id": new_king.id, "name": new_king.name}), 201

    kings = King.query.all()
    return jsonify([{
        "id": k.id,
        "name": k.name,
        "englishName": k.englishName,
        "dynasty": k.dynasty,
        "reign": k.reign,
        "bio": k.bio,
        "achievements": k.achievements,
        "cartouche": k.cartouche,
        "docId": k.docId,
        "image": f"/api/uploads/{k.image}" if k.image else "",
        "era": k.era_id
    } for k in kings])

@app.route('/api/kings/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def handle_single_king(id):
    king = King.query.get_or_404(id)
    
    if request.method == 'GET':
        return jsonify({
            "id": king.id,
            "name": king.name,
            "englishName": king.englishName,
            "dynasty": king.dynasty,
            "reign": king.reign,
            "bio": king.bio,
            "achievements": king.achievements,
            "cartouche": king.cartouche,
            "docId": king.docId,
            "image": f"/api/uploads/{king.image}" if king.image else "",
            "era_id": king.era_id
        })
        
    if request.method == 'PUT':
        data = request.form
        if 'name' in data: king.name = data['name']
        if 'englishName' in data: king.englishName = data['englishName']
        if 'dynasty' in data: king.dynasty = data['dynasty']
        if 'reign' in data: king.reign = data['reign']
        if 'bio' in data: king.bio = data['bio']
        if 'achievements' in data: king.achievements = data['achievements']
        if 'cartouche' in data: king.cartouche = data['cartouche']
        if 'docId' in data: king.docId = data['docId']
        if 'era_id' in data: king.era_id = data['era_id']
        
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename != '':
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                king.image = filename
                
        db.session.commit()
        return jsonify({"message": "King updated successfully"})
        
    if request.method == 'DELETE':
        db.session.delete(king)
        db.session.commit()
        return '', 204

@app.route('/api/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


# --- SEED DATA ---
_SEED_ERAS = [
    {"id": 1, "name": "العصر المبكر",   "years": "3100-2686 ق.م"},
    {"id": 2, "name": "الدولة القديمة", "years": "2686-2181 ق.م"},
    {"id": 3, "name": "الدولة الوسطى", "years": "2055-1650 ق.م"},
    {"id": 4, "name": "الدولة الحديثة","years": "1550-1069 ق.م"},
    {"id": 5, "name": "العصر المتأخر",  "years": "664-332 ق.م"},
]

_SEED_KINGS = [
    {
        "id": 1, "name": "رمسيس الثاني", "englishName": "Ramesses II",
        "dynasty": "الأسرة 19", "reign": "1279–1213 ق.م",
        "bio": "يعتبر رمسيس الثاني من أقوى وأهم فراعنة الدولة الحديثة. اشتهر بانتصاراته العسكرية وبنائه للمعابد الضخمة مثل أبو سمبل والكرنك.",
        "achievements": "معركة قادش\nمعبد أبو سمبل\nأول معاهدة سلام في التاريخ",
        "cartouche": "𓇳𓄶𓈖𓂠𓏠", "image": "ramesses_ii.png", "docId": "14rD63h1G1Y", "era_id": 4,
    },
    {
        "id": 2, "name": "توت عنخ آمون", "englishName": "Tutankhamun",
        "dynasty": "الأسرة 18", "reign": "1332–1323 ق.م",
        "bio": "الملك الشاب الذي نال شهرة عالمية بعد اكتشاف مقبرته كاملة في وادي الملوك عام 1922.",
        "achievements": "إعادة عبادة آمون\nمقبرة KV62 المذهلة\nالكنوز الذهبية الفريدة",
        "cartouche": "𓇋𓏠𓈖𓏏𓅱𓏏𓇓𓀻", "image": "tutankhamun.png", "docId": "v_zL2Fp1y1o", "era_id": 4,
    },
    {
        "id": 3, "name": "كليوباترا السابعة", "englishName": "Cleopatra VII",
        "dynasty": "العصر البطلمي", "reign": "51–30 ق.م",
        "bio": "آخر حكام المملكة البطلمية في مصر. اشتهرت بذكائها السياسي ودهائها.",
        "achievements": "إجادة عدة لغات\nالتحالف مع يوليوس قيصر\nبناء أسطول بحري قوي",
        "cartouche": "𓎼𓃭𓇋𓍯𓊪𓄿𓂧𓏏𓂋𓄿", "image": "cleopatra.png", "docId": "Z3W_717kIAQ", "era_id": 5,
    },
    {
        "id": 4, "name": "أخناتون", "englishName": "Akhenaten",
        "dynasty": "الأسرة 18", "reign": "1353–1336 ق.م",
        "bio": "الفرعون الذي أحدث ثورة دينية بدعوته لعبادة إله واحد (آتون).",
        "achievements": "التوحيد الديني\nبناء مدينة أخيتاتون\nثورة الفن العمارني",
        "cartouche": "𓇋𓏠𓈖𓄿𓐍𓈖𓇋𓏏𓈖", "image": "akhenaten.png", "docId": "l_O_X01U2tU", "era_id": 4,
    },
    {
        "id": 5, "name": "تحتمس الثالث", "englishName": "Thutmose III",
        "dynasty": "الأسرة 18", "reign": "1479–1425 ق.م",
        "bio": "يُعرف بـ 'نابليون مصر القديمة' لعبقريته العسكرية الفذة.",
        "achievements": "معركة مجدو\nتوسيع الإمبراطورية\nبناء مسلات ضخمة",
        "cartouche": "𓇳𓏠𓆣𓂋", "image": "thutmose_iii.png", "docId": "l_O_X01U2tU", "era_id": 4,
    },
]

def seed_database():
    """Seed initial data only when tables are empty (idempotent)."""
    if Era.query.count() == 0:
        for e in _SEED_ERAS:
            db.session.add(Era(id=e["id"], name=e["name"], years=e["years"]))
        db.session.commit()
        print(f"[seed] Inserted {len(_SEED_ERAS)} eras.")

    if King.query.count() == 0:
        for k in _SEED_KINGS:
            db.session.add(King(
                id=k["id"], name=k["name"], englishName=k["englishName"],
                dynasty=k["dynasty"], reign=k["reign"], bio=k["bio"],
                achievements=k["achievements"], cartouche=k["cartouche"],
                image=k["image"], docId=k["docId"], era_id=k["era_id"],
            ))
        db.session.commit()
        print(f"[seed] Inserted {len(_SEED_KINGS)} kings.")

    # Reset sequences for PostgreSQL
    if DATABASE_URL and 'postgresql' in DATABASE_URL:
        try:
            db.session.execute(db.text("SELECT setval(pg_get_serial_sequence('era', 'id'), COALESCE(MAX(id), 1)) FROM era;"))
            db.session.execute(db.text("SELECT setval(pg_get_serial_sequence('king', 'id'), COALESCE(MAX(id), 1)) FROM king;"))
            db.session.commit()
            print("[seed] Reset database sequences for PostgreSQL.")
        except Exception as e:
            db.session.rollback()
            print(f"[seed] Error resetting sequences: {e}")


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        seed_database()
    app.run(host='0.0.0.0', port=5000)

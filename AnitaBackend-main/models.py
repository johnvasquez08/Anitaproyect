# models.py
from flask_sqlalchemy import SQLAlchemy
import datetime

db = SQLAlchemy()

class Usuario(db.Model):
    __tablename__ = 'usuarios'
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.String(255), unique=True)
    nombre = db.Column(db.String(255))
    correo = db.Column(db.String(255))
    password = db.Column(db.String(255))
    fecha_registro = db.Column(db.DateTime, default=datetime.datetime.utcnow)

class Recordatorio(db.Model):
    __tablename__ = 'recordatorios'
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.String(255), db.ForeignKey('usuarios.sender_id'), nullable=False)
    mensaje = db.Column(db.Text, nullable=False)
    fecha = db.Column(db.DateTime, nullable=False)
    estado = db.Column(db.String(20), default='pendiente')
    usuario = db.relationship('Usuario', backref=db.backref('recordatorios', lazy=True))

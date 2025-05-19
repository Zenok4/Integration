from database import db 

# 🔹 Model cho MySQL: positions
class Position (db.Model):
    __tablename__ = 'positions'
    __bind_key__ = "mysql_db"
    
    PositionID = db.Column(db.Integer, primary_key=True)
    PositionName = db.Column(db.String(100), nullable=False)

# 🔹 Model cho MySQL: Positions
class Position(db.Model):
    __tablenama__ = 'Positions'
    __bind_key__ = "sqlserver_db"
    
    PositionID = db.Column(db.Integer, primary_key=True)
from marshmallow import Schema, fields

class QuestionSchema(Schema):
    id = fields.Int(required=True)
    text = fields.Str(required=True)
    options = fields.List(fields.Str(), required=True)
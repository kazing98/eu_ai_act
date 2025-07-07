from marshmallow import Schema, fields

class QuestionSchema(Schema):
    id = fields.Int(required=True)
    question = fields.Str(required=True)
    options = fields.List(fields.Str(), required=True)
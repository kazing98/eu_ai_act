from marshmallow import Schema, fields

class QuestionSchema(Schema):
    id = fields.Int(required=True)
    question = fields.Str(required=True)
    options = fields.Dict(keys=fields.Str(), values=fields.Str(), required=True)
#ChatGPT code to force the model to return a 1 (for testing purposes)
class ForcedModelWrapper:
    def __init__(self, original_model):
        self.original_model = original_model

    def predict(self, X):
        return [1 for _ in X]

    def __getattr__(self, name):
        original_model = object.__getattribute__(self, 'original_model')
        return getattr(original_model, name)

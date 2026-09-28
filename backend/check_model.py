import joblib

model = joblib.load(
    "model/ner_resq_landslide_model.pkl"
)

print("Model type:", type(model))

print("Number of features:", model.n_features_in_)

if hasattr(model, "feature_names_in_"):
    print("\nFeature names:")
    for feature in model.feature_names_in_:
        print(feature)
else:
    print("\nModel does not contain feature names.")
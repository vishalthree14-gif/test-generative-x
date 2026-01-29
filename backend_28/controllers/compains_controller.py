from models.compains_model import CompainsCollection
from models.compains_data_model import CompainsDataCollection
from flask import g, jsonify

def create_compains(name):

    user_id = g.user_id

    already_exist = CompainsCollection.find_compains(name, user_id)

    if already_exist:
        return jsonify({"message": "compains already exist!"}), 200

    try:
        doc_comp = CompainsCollection(
            user_id=user_id,
            name=name
        )

        doc_comp.save()

    except Exception as e:
        return jsonify({"error": e})

    return jsonify({"message": "compains created successfully!"}), 201


def get_compains():
    user_id = g.user_id

    cursor = CompainsCollection.find_user_compains(user_id)

    all_compains = []

    for doc in cursor:
        doc["_id"] = str(doc["_id"])
        doc["user_id"] = str(doc["user_id"])
        all_compains.append(doc)

    return jsonify({"data": list(all_compains)}), 200




def add_people(name, compain_id, email_address, whatsapp_number):

    already_exist = CompainsDataCollection.find_email(email_address, compain_id)

    if already_exist:
        return jsonify({"message": "member already exist"}), 200
    
    doc_save = CompainsDataCollection(
        name=name,
        compains_id=compain_id,
        email_address=email_address,
        whatsapp_number=whatsapp_number
    )

    doc_save.save()

    return jsonify({"message": "member added successfully"}), 201



def get_all_people(compains_id):

    cursor = CompainsDataCollection.find_members(compains_id)

    all_data = []

    for doc in cursor:
        doc["_id"] = str(doc["_id"])
        doc["compains_id"] = str(doc["_id"])

        print("******************", doc)

        all_data.append(doc)

    return jsonify({"data": all_data}), 200


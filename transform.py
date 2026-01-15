import csv
import json

data = {
    "tools": []
}

with open("list.csv") as f:
    row_type = None
    row_types = []
    for row in csv.DictReader(f):
        if row["Type"] != "":
            row_type = row["Type"].strip()
            row_types.append(row_type)
        else:
            row["Type"] = row_type
        del row["Sl. No. "]
        row["Working"] = True if row["Working"] == "TRUE" else "FALSE"

        data["tools"].append({
            "type": row["Type"],
            "toolName": row["Tool"].strip(),
            "link": row["Link"].strip(),
            "working": row["Working"]
        })

    data["categories"] = list(set(row_types))

with open("src/lib/data.json", "w") as f:
    json.dump(data, f)
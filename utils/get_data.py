import json
import yaml

data_list = []

for n in range(3):
  with open("json/part_10{}.json".format(n), "r", encoding="utf-8") as f:
    data = json.load(f)

  for item in data:
    for tag in item["tag_list"]:
      if "版" in tag["tag_name"]:
        file_tag = tag["tag_name"]
    data_list.append({
      "file_id": item["id"],
      "file_name": item["global_title"]["zh-CN"],
      "file_cover_url": item["custom_properties"]["thumbnails"][0],
      "file_tag": file_tag,
    })

with open("textbook.yml", "w", encoding="utf-8") as f1:
  yaml.dump(data_list, f1, default_flow_style=False, sort_keys=False, allow_unicode=True, width=500)

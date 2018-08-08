import xml.etree.ElementTree as ET
from random import choice
import json

with open("bus") as f:
    root = ET.fromstring(f.read())

l = {
    c.find("kanji").text:
        {
        "lat": float(c.find("lat").text),
        "lng": float(c.find("lng").text)
        }
    for c in root
}

with open("bunsetu.xml") as f:
    root = ET.fromstring(f.read())

main = list(set(
    c.find("kanji").text
    for c in root.find("stops")
))

with open("./bus.js", "w") as f:
    f.write("export const bus = ")
    f.write(json.dumps(l))
    f.write(";")
    f.write("export const mainstop = ")
    f.write(json.dumps(main))
    f.write(";")
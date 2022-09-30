import csv
import json

def main():
    out = []
    codes = []
    with open("data.csv", "r", encoding="utf-8") as f:
        reader = csv.reader(f)
        for row in reader:
            if row[2] in codes: print("ERROR: "+row[2])
            else: codes.append(row[2])
            r = [row[2], {"name":row[1], "uid":row[0], "title":"Hidden", "hint":"", "location":"Verification Pending"}]
            out.append(r)
    #print(json.dumps(out[1:]))

if __name__ == "__main__":
    main()
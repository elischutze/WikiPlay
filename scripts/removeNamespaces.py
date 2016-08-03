import re
import sys

input = sys.argv[1]
output = sys.argv[2]

print("input:",input)
print("output:",output)
count=0
with open(input,'r') as inputFile:
    with open(output,'a') as outputFile:
        for line in inputFile:
            if(line.split(",")[1]=="\"0\""):
                print(line)
                outputFile.write(line)


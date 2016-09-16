"""
This helper script turns our preliminary pipe delimiters
to correctly placed commas to prepare data for import
"""
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
            newline = line.replace("|","\"")
            count+=1
            print(count,":",newline)
            outputFile.write(newline)

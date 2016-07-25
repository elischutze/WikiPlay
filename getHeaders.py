import re
import sys

input = sys.argv[1]
output = sys.argv[2]

startpattern = re.compile('^CREATE TABLE')
endpattern = re.compile('  PRIMARY KEY')

with open(input,'r') as file:




#!/usr/bin/python
# -*- coding: utf-8 -*-

user_text = raw_input("Give me some text>")
lower_text  = user_text.lower()
text_length = len(user_text)
print("Your text is {}, its length is {}".format(user_text, text_length))
print("In lowercase, that’s {}".format(lower_text))

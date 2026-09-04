import os
os.add_dll_directory(r"C:\Windows\System32\Microsoft-Edge-WebView")
os.add_dll_directory(r"C:\Users\DELL\AppData\Local\Programs\Python\Python312")

import qiskit
print('Qiskit version:', qiskit.__version__)
import qiskit_aer
print('Aer version:', qiskit_aer.__version__)

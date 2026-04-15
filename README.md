## Secure Client-Side Authentication
This project was created to provide a secure method of authentication without 
need of a server. To achieve this goal, the page takes the user input, 
derives a key with it that may or may not unlock an AES-Encrypted string
containing the destination website.   
While this method is imperfect, it provides basic functional security locally, 
without need of a server or backend. It is also easy to set up, just use the 
[AES Key Tool](https://29miaoet.github.io/password_redirect/key_generate.html), 
or the raw [JavaScript browser console code](https://29miaoet.github.io/password_redirect/key_generate.js) 
to get the relevant salt, iv and encrypted string. Then paste it into the relevant areas of the
[template script](); after you are done, add it to your code and you have a functional client-side 
authenticator!  

Attributes:
  
✅ AES-GCM Encryption  
✅ PBKDF2 with 150000 iterations  
✅ SHA256 key derivation  
✅ pseudorandom salt and IV generation  
  
**Recommended 12+ digit password with letters, numbers, and signs.**  
<sub>This code is imperfect, it is designed to provide only basic security.<sub>

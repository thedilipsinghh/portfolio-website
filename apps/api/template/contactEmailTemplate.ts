interface ContactEmailData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

const contactEmailTemplate = ({ name, email, subject, message }: ContactEmailData) => {
    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">

<style>
  body{
    margin:0;
    padding:0;
    background:#f4f6f9;
    font-family:Arial, sans-serif;
  }

  .wrapper{
    padding:40px 0;
  }

  .container{
    max-width:600px;
    margin:auto;
    background:#ffffff;
    border-radius:10px;
    overflow:hidden;
    box-shadow:0 6px 18px rgba(0,0,0,0.08);
  }

  .header{
    background:linear-gradient(135deg,#4f46e5,#6366f1);
    color:white;
    padding:25px;
    text-align:center;
  }

  .header h2{
    margin:0;
    font-size:22px;
  }

  .content{
    padding:30px;
  }

  .info{
    margin-bottom:18px;
    font-size:15px;
  }

  .label{
    font-weight:bold;
    color:#555;
  }

  .value{
    color:#222;
  }

  .message-box{
    background:#f9fafc;
    border-left:4px solid #4f46e5;
    padding:18px;
    border-radius:6px;
    margin-top:10px;
    line-height:1.6;
  }

  .footer{
    padding:20px;
    text-align:center;
    font-size:13px;
    color:#777;
    border-top:1px solid #eee;
  }

  .tag{
    display:inline-block;
    background:#eef2ff;
    color:#4f46e5;
    padding:4px 10px;
    border-radius:20px;
    font-size:12px;
    margin-top:8px;
  }

</style>
</head>

<body>

<div class="wrapper">

<div class="container">

<div class="header">
<h2>📩 New Portfolio Contact</h2>
</div>

<div class="content">

<div class="info">
<span class="label">Name:</span>
<span class="value">${name}</span>
</div>

<div class="info">
<span class="label">Email:</span>
<span class="value">${email}</span>
</div>

<div class="info">
<span class="label">Subject:</span>
<span class="value">${subject}</span>
</div>

<div class="info">
<span class="label">Message:</span>

<div class="message-box">
${message}
</div>

</div>

<span class="tag">Portfolio Contact Form</span>

</div>

<div class="footer">
Message received from your portfolio website.<br>
© ${new Date().getFullYear()} Dilip Singh
</div>

</div>

</div>

</body>
</html>
`;
};

export default contactEmailTemplate;

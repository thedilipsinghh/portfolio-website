interface ClientReplyData {
    name?: string;
    message?: string;
}

const clientReplyTemplate = (data: ClientReplyData = {}) => {
    const { name, message } = data;

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
    font-family:Arial, Helvetica, sans-serif;
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
    background:linear-gradient(135deg,#06b6d4,#3b82f6);
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
    color:#333;
    line-height:1.6;
  }

  .message-box{
    background:#f9fafc;
    border-left:4px solid #3b82f6;
    padding:18px;
    border-radius:6px;
    margin-top:15px;
  }

  .button{
    display:inline-block;
    margin-top:20px;
    padding:12px 20px;
    background:#3b82f6;
    color:white;
    text-decoration:none;
    border-radius:6px;
    font-size:14px;
  }

  .footer{
    text-align:center;
    padding:20px;
    font-size:13px;
    color:#777;
    border-top:1px solid #eee;
  }

  .tag{
    display:inline-block;
    background:#e0f2fe;
    color:#0369a1;
    padding:4px 10px;
    border-radius:20px;
    font-size:12px;
    margin-top:15px;
  }

</style>

</head>

<body>

<div class="wrapper">

<div class="container">

<div class="header">
<h2>✅ Message Received</h2>
</div>

<div class="content">

<h3>Hi ${name || "there"},</h3>

<p>
Thank you for contacting me through my portfolio.  
I have received your message and will review it shortly.
</p>

<p>
I usually respond within <b>24–48 hours</b>.
</p>

<p><b>Your message:</b></p>

<div class="message-box">
${message || ""}
</div>

<span class="tag">Portfolio Contact Confirmation</span>

<br>

<a href="https://my-portfolio-client-lemon.vercel.app" class="button">
Visit My Portfolio
</a>

</div>

<div class="footer">

<p>Best Regards</p>
<p><b>Dilip Singh</b></p>
<p>MERN Stack Developer</p>

</div>

</div>

</div>

</body>
</html>
`;
};

export default clientReplyTemplate;

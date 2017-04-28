# Hi-PA
A Responsive, Multi-sensor, Smart, Web-App, Which Connects Audience &amp; Presenter

This branch is for Script Writer. It is not merged with master branch currently.
You can run demo with python(up to 3.0) flask.
If you have python3 and python3-pip, you can run demo by
```
pip3 install flask
python3 run-demo.py
```

Default port is 1995. Go to localhost:1995 and it will show you the demo page.

### Description
The page use *Google Cloud Speech API* for speech recognition and *clmtrackr* for mouth tracking. We are going to write a script based on text converted from speech. We use mouth tracking to determine if the person is speaking or not. Method for this determination is flexable; currenly we just use gap between position of upper lip and lower lip.

### Note
You need speaker and webcam to use demo. If you do not have webcam, it automatically use default video.


*This is a project in Creative-Integrated-Design course in Seoul National University, advised by NS Solution.*

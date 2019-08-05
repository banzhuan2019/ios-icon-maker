<template>
  <div>
      <Row>
          <Col span="4">  <Button class="select1" v-on:click="makeActive('select1')">选择原始目录</Button></Col>
          <Col span="20"><p>{{inputRoot}}</p></Col>
      </Row>
      <br>
      <Row>
          <Col span="4">    <Button class="select2" v-on:click="makeActive('select2')">选择输出目录</Button></Col>
          <Col span="20"><p>{{outputRoot}}</p></Col>
      </Row>
      <br>
      <Row>
          <Col span="4">   <Button v-on:click="generate">点我开始生成</Button></Col>
          <Col span="20"> <p>{{msg}}</p></Col>
      </Row>
  </div>
</template>

<script>
  import { remote } from 'electron';
   import fs from 'fs';
   import path from 'path';
   import jimp from 'jimp';
  import child_process from 'child_process';

  export default {
    data () {
      return {
          msg : "我们生成icon吧",
        active : 'select1',
          locate : './resource/script/icongenerate.js',
          inputRoot: './resource/input/',
          outputRoot: './resource/output/',
      }
    },
    methods :{
      makeActive(item){
        // 模型改变，视图会自动更新
        this.active = item;
        this.select(item);
      },
      select(item){
        let savePath = remote.dialog.showOpenDialog({
          properties: ['openDirectory'],
          title: '选择输入文件路径'
        });
        if (savePath) {
            console.log("savePath " + savePath);
          if(item == "select1"){
              this.inputRoot = savePath.join("/");
          }
          else{
            this.outputRoot = savePath.join("/");
          }
        }
      },
      generate(){
          var targetFilePath = path.resolve("./resource/script/publishConfig.json");
          var bytes = fs.readFileSync(targetFilePath);
          var json = JSON.parse(bytes);
          var root1 = path.resolve(this.inputRoot);
          var root2 = path.resolve(this.outputRoot);

          root1 = root1.replace(/\\/g ,"/");
          root2 = root2.replace(/\\/g ,"/");

          json.inputRoot = root1;
          json.outputRoot = root2;
          fs.writeFileSync(targetFilePath, JSON.stringify(json));

          let publish_m3jp_testProcess = child_process.exec("node " + path.resolve(this.locate), {
              cwd: path.resolve(".")
          });

          // 打印正常的后台可执行程序输出
          publish_m3jp_testProcess.stdout.on('data', (data)=>  {
              console.log('stdout: ' + data);
              this.msg = "正在生成icon!";
          });

          // 打印错误的后台可执行程序输出
          publish_m3jp_testProcess.stderr.on('data', (data)=>  {
              console.log('stderr: ' + data);
          });

          // 退出之后的输出
          publish_m3jp_testProcess.on('close', (code)=> {
              console.log('out code：' + code);
              this.msg = "生成icon完成!";
          });
      }
    }
  }
</script>

<style scoped>
  *{
    margin:0;
    padding:0;
  }

  body{
    font:15px/1.3 'Open Sans', sans-serif;
    color: #5e5b64;
    text-align:center;
  }

  section, footer, header, aside, nav{
    display: block;
  }

  p{
    font-size:18px;
    color:#7d9098;
  }

  p b{
    color:#ffffff;
    display:inline-block;
    padding:5px 10px;
    background-color:#c4d7e0;
    border-radius:2px;
    text-transform:uppercase;
    font-size:18px;
  }
</style>

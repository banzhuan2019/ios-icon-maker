/**
 * Created by banzhuan2019 on 2019/7/18.
 *  生成ios版本所需各尺寸icon
 */

const jimp = require('jimp');
var fs = require("fs");
var path = require("path");

var config = require("./publishConfig");

var outputRoot = config.outputRoot + "/";
var inputRoot = config.inputRoot + "/";

start();

function start()
{
	foreachFile();
	copyContents();
}

function foreachFile()
{
	var srcFilePath = path.resolve(inputRoot + "Contents.json");
	var contents = fs.readFileSync(srcFilePath);
	var json = JSON.parse(contents);
	console.log("contents" + json);
	var imgs = json["images"];
	for(var i=0; i<imgs.length; i++)
	{
	var obj = imgs[i];
	var filename = obj["filename"];
	console.log(filename);
	
	var size = obj["size"];
	size = filename.replace(new RegExp(/icon-/), "");
	size = size.replace(new RegExp(/@\d+\D+/), "");
	size = size.replace(new RegExp(/.png/), "");
	size = size.replace(new RegExp(/-ipad/), "");
	
	console.log("size " + size);
	
	var scale = obj["scale"];
	scale = scale.replace(new RegExp(/\D+/), "");
	console.log("scale " + scale);
	
	console.log("  ");
	
	createImage(filename, size, scale);
	}
}

function createImage(file, size, scale)
{
	var input = inputRoot + "icon.png";
	var output = outputRoot + file;
	var width = size * scale;
	var height = size * scale;

	jimp.read(input)
  .then(lenna => {
    return lenna
      .resize(width, height) 
      .write(output); 
  })
  .catch(err => {
    console.error(err);
  });
}

function copyContents()
{
	var targetFilePath = path.resolve(outputRoot + "Contents.json");
	var srcFilePath = path.resolve(inputRoot + "Contents.json");
	var bytes = fs.readFileSync(srcFilePath);
    fs.writeFileSync(targetFilePath, bytes);
}

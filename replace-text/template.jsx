var rootGenFolder = '';
var rootTextFolder = '';

main();

/**
 * 入口方法
 */
function main() {
    var doc = app.activeDocument;

    // 图片生成的根目录
    rootGenFolder = doc.path + '/gen';
    // txt文件的根目录
    rootTextFolder = doc.path + '/text';

    // 如果没有gen目录，则创建gen目录
    checkAndMakeFolder(rootGenFolder);

    // 处理模板所在目录的text目录下所有的txt文件
    hanldeTextFolder(rootTextFolder);
}

/**
 * 处理path目录下所有的txt
 * @param {String}} txt文件夹的绝对路径
 */
function hanldeTextFolder(path) {
    var folderText = new Folder(path);

    // alert('folder: ' + path);

    if (folderText) {
        var fileList = folderText.getFiles();
        var fileLen = fileList.length;

        for (var i = 0; i < fileLen; i++) {
            var subPath = fileList[i].path + '/' + fileList[i].name;

            // 如果是文件夹，则递归处理
            if (fileList[i].getFiles) {
                hanldeTextFolder(subPath);
            }
            // 如果是文件，则直接处理
            else {
                handleTextFile(subPath);
            }
        }
    }
}

/**
 * 把txt文件的文字设置到psd模板中并保存为png
 * @param {String} path txt文件的绝对路径
 */
function handleTextFile(path) {
    // 当前ps打开的文档
    var doc = app.activeDocument;
    // 当前名称为text的图层
    var layerText = doc.layers.getByName('text');

    // 模板要替换的txt文件
    var file = new File(path);
    // txt文件的内容
    var content = '';
    // 获取txt文件相对于txt文件根目录的项目路径
    var relativeSavePath = file
        .getRelativeURI(rootTextFolder)
        .replace(file.name, '')
        .slice(0, -1);

    // 打开读取并关闭txt文件
    file.open('r');
    // readContent(file);
    content = file.read();
    file.close();

    // 设置模板中text图层的内容为txt文件的内容
    layerText.textItem.contents = content
        .replace(/\r\n/g, '\r')
        .replace(/\n/g, '\r');

    // alert(file.encoding)

    // 保存当前文档为png
    savePng(file.name, relativeSavePath);
}

/**
 * 保存文件到psd文件所在目录的gen子目录下，保存为png
 * @param {String} filename 相对路径
 * @param {String} relativeSavePath 相对路径
 */
function savePng(filename, relativeSavePath) {
    var doc = app.activeDocument;
    var savePath = rootGenFolder + '/' + relativeSavePath;

    // 如果没有子目录，则创建目录
    checkAndMakeFolder(savePath);

    var file = new File(savePath + '/' + filename + '.png');
    // var opts = new PhotoshopSaveOptions();
    var opts = new PNGSaveOptions();

    doc.saveAs(file, opts, true);
}

/**
 * 如果没有目录，则创建目录
 * @param {String} path 要检查的子目录
 */
function checkAndMakeFolder(path) {
    var folder = new Folder(path);

    if (!folder.exists) {
        folder.create();
    }
}

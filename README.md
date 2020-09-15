# pix2pix-ml5-demo<br/><br/>
## [blog post](https://medium.com/@dongphilyoo/how-to-train-pix2pix-model-and-generating-on-the-web-with-ml5-js-87d879fb4224)
## [interactive demo](https://dongphilyoo.github.io/pix2pix-ml5-demo/index.html)
## [webcam demo](https://dongphilyoo.github.io/humansofnowhere/index.html)
<img src="https://media.giphy.com/media/J13pCflhMCXEr3yYll/giphy.gif" width="1200">

### [Pix2Pix](#Pix2Pix)
### [Data Preparation](#Create-own-dataset)
### [Training Pix2Pix](#Training)
### [Use the Model](#Use-the-model-with-ml5)<br/>


## Pix2Pix

### What is it?
Pix2Pix, or Image-to-Image Translation, can learn how to convert images of one type into another type of new image. Pix2Pix uses a kind of generative algorithm called Conditional Adversarial Network(cGAN) where the generation process is “conditioned” on the input image. It learns a mapping from an input image to an output image.<br/><br/>
<img src="https://i.imgur.com/bSxuOv0.png" width="49%"/>
<img src="https://i.imgur.com/Uqi85JA.png" width="49%"/>

##### Pros<br/>
* no assumptions
* learns the objective during training
* requires small number of samples
##### Cons<br/>
* overfitting to the training samples; repetitive || patchy

### What it does?
[Interactive Demo - Christopher Hesse](https://affinelayer.com/pixsrv/)<br/>
[ML4A - Gene Kogan](https://ml4a.github.io/guides/Pix2Pix/)

#### [What we will build?](https://dongphilyoo.github.io/pix2pix-ml5-demo/index.html)<br/>


## Create own dataset

![](https://cdn-images-1.medium.com/max/1600/1*QNZUc16K5Ooo8ZF0jaJJkQ.png)
<br/>
It should consist of:<br/>
* 512x256 size (pairs of 256x256 images)
* hundreds of images (in same format)
* identical direction (A to B || B to A)

### Tools
[instagram-scraper](https://github.com/rarcega/instagram-scraper)<br/>
[body-pix / person segmentation](https://github.com/tensorflow/tfjs-models/tree/master/body-pix)<br/>


## Training

### Prerequisite
## downgrade python3
[https://chriscummins.cc/2018/brew-python-downgrade/](https://chriscummins.cc/2018/brew-python-downgrade/)
#### Install Python3
```
# check python3 version
python3 --version

# install xcode
xcode-select --install

# install homebrew
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

# check homebrew
brew doctor

# install python3 with homebrew
brew install python3

# check python3 version
python3 --version
```
#### Install pip
```
python --version
sudo easy_install pip
```
#### Install Tensorflow
```
pip install tensorflow

# make sure tensorflow installed
python -c "import tensorflow; print(tensorflow.__version__)"
```
#### Install Spell CLI
```
pip install spell

spell login
spell whoami
```
### Clone the repo
```
git clone https://github.com/affinelayer/pix2pix-tensorflow.git
cd pix2pix-tensorflow
open .
```
#### Download dataset
[download](https://drive.google.com/open?id=1qh5wnj7i06Yl7Q3fWpdOGhh9Izk6_kNp)(24MB, 277 images)<br/>
```
# move downloaded folder to pix2pix-tensorflow folder

# Let spell know the newly downloaded dataset
git add .
git commit -m "added input image data"
```
### Train the model
```
# train the model

# If you add `--ngf 32 --ndf 32` when training the model, the output model will be smaller, and it will take less time to train.
# The command reduces the number of filters on generator and discriminator from 64(default) to 32.

spell run --machine-type V100 \
          --framework tensorflow \
          "python pix2pix.py \
          --mode train \
          --input_dir input \
          --output_dir output \
          --max_epochs 50 \
          --which_direction BtoA \
          --ngf 32 --ndf 32"

# After the run is finished (~5min)
# check out the result 
spell ls runs/YOUR_RUN_NUMBER
spell ls runs/YOUR_RUN_NUMBER/output
```
### Test the model
download test_images, locate into pix2pix-tensorflow root folder<br/>
[download test images](https://drive.google.com/open?id=1mZ9SjUAcTZuZjHiIwjGUzoxP3mpe80Ka)
```
# in pix2pix-tensorflow root folder
mkdir output
cd output

# Copy the result folder, takes ~5min
spell cp runs/YOUR_RUN_NUMBER/output

# test the model
cd ..
python pix2pix.py \
     --mode test \
     --output_dir model_test \
     --input_dir test_images \
     --checkpoint output

# After testing, you should be able to see output images in the model_test folder by opening the `index.html` file in the browser
```
### Wanna fairly decent result? 🕒💸 is the key.
![](https://i.imgur.com/wUknw0X.jpg)

### Export the model
```
# export the model
python pix2pix.py --mode export --output_dir export/ --checkpoint output/ --which_direction BtoA

# It will create a new export folder

# Port the model to tensorflow.js (python 2 doesn’t have tempfile, so use python3 instead)
cd server
cd static
mkdir model
cd ..
python3 tools/export-checkpoint.py --checkpoint ../export --output_file static/model/YOUR_MODEL_NAME_BtoA.pict

# You should be able to get a file named YOUR_MODEL_NAME_BtoA.pict in /server/static/model/ folder.
```
<br/>

## Use the model with ml5

#### Download ported model (2000epochs)<br/>
[model download](https://drive.google.com/open?id=1uoSIWccDP_vVFkeJRY6KqO16hgaesmIG)

### Clone repo & run the app
```
git clone https://github.com/dongphilyoo/unconference-2019-pix2pix.git
cd pix2pix-ml5-demo
mkdir model
cd model

# copy the model file you got to model folder
cp /PATH/TO/SOURCE/FILE .

# open app.js in editor, put the model file path into the line:
# pix2pix = ml5.pix2pix('model/model_BtoA_2000.pict', modelLoaded);

# run server
python -m SimpleHTTPServer

# go to http://localhost:8000
```

### Acknowledgement
Yining Shi's training process tutorial<br/>
[https://github.com/yining1023/pix2pix_spell](https://github.com/yining1023/pix2pix_spell)<br/>

### Resources
[Spell Documentation](https://www.spell.run/docs/home)<br/>
[pix2pix original paper](https://arxiv.org/pdf/1611.07004.pdf)<br/>
[NVIDIA pix2pixHD (Pytorch)](https://github.com/NVIDIA/pix2pixHD)<br/>
[NVIDIA vid2vid (Pytorch)](https://github.com/NVIDIA/vid2vid)<br/>
[pix2pix tensorflow implementation](https://affinelayer.com/pix2pix/)<br/>
[ml5.js pix2pix](https://ml5js.org/docs/Pix2Pix)<br/>
[Medium Post](https://medium.com/@dongphilyoo/how-to-train-pix2pix-model-and-generating-on-the-web-with-ml5-js-87d879fb4224)<br/>
[humansofnowhere](https://dongphilyoo.github.io/humansofnowhere/index.html)


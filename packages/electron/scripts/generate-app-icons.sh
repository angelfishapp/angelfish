#!/usr/bin/env bash

# Generates "resources/icons/icon.icns" file for MacOS Package

echo "Generating resources/icons/icon.icns..."

input_filepath="resources/icons/png/1024.png"
output_iconset_name="resources/icons/icon.iconset"
mkdir $output_iconset_name

sips -z 16 16     $input_filepath --out "${output_iconset_name}/icon_16x16.png"
sips -z 32 32     $input_filepath --out "${output_iconset_name}/icon_16x16@2x.png"
sips -z 32 32     $input_filepath --out "${output_iconset_name}/icon_32x32.png"
sips -z 64 64     $input_filepath --out "${output_iconset_name}/icon_32x32@2x.png"
sips -z 128 128   $input_filepath --out "${output_iconset_name}/icon_128x128.png"
sips -z 256 256   $input_filepath --out "${output_iconset_name}/icon_128x128@2x.png"
sips -z 256 256   $input_filepath --out "${output_iconset_name}/icon_256x256.png"
sips -z 512 512   $input_filepath --out "${output_iconset_name}/icon_256x256@2x.png"
sips -z 512 512   $input_filepath --out "${output_iconset_name}/icon_512x512.png"
cp $input_filepath "${output_iconset_name}/icon_512x512@2x.png"

iconutil -c icns $output_iconset_name

rm -R ${output_iconset_name}

# Generate Windows "resources/icons/icon.ico" file using ImageMagick Docker Image

echo "Generating resources/icons/icon.ico..."

input_file="1024.png"
mkdir resources/icons/tmp

docker run -v "${PWD}/resources/icons:/imgs" dpokidov/imagemagick /imgs/png/$input_file -resize 16x16 -depth 32 /imgs/tmp/16-32.png
docker run -v "${PWD}/resources/icons:/imgs" dpokidov/imagemagick /imgs/png/$input_file -resize 32x32 -depth 32 /imgs/tmp/32-32.png
docker run -v "${PWD}/resources/icons:/imgs" dpokidov/imagemagick /imgs/png/$input_file -resize 48x48 -depth 32 /imgs/tmp/48-32.png
docker run -v "${PWD}/resources/icons:/imgs" dpokidov/imagemagick /imgs/png/$input_file -resize 256x256 -depth 32 /imgs/tmp/256-32.png
docker run -v "${PWD}/resources/icons:/imgs" dpokidov/imagemagick /imgs/tmp/16-32.png /imgs/tmp/32-32.png /imgs/tmp/48-32.png /imgs/tmp/256-32.png /imgs/icon.ico

rm -R resources/icons/tmp
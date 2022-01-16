---
title: "Argoverse 2: next generation datasets for self-driving perception and forecasting"
authors: ["[Benjamin Wilson](https://bwilson.dev/)", "William Qi", "Tanmay Agarwal", "[John Lambert](https://johnwlambert.github.io/)", "Jagjeet Singh", "Siddhesh Khandelwal", "[Bowen Pan](http://people.csail.mit.edu/bpan/)", "Ratnesh Kumar", "Andrew Hartnett", "[**Jhony K. Pontes**](https://www.jhonykaesemodel.com)", "[Deva Ramanan](http://www.cs.cmu.edu/~deva/)", "Peter Carr", "[James Hays](https://faculty.cc.gatech.edu/~hays/)"]
date: "2021-11-23T00:00:00Z"
doi: ""

# Schedule page publish date (NOT publication's date).
publishDate: "2022-01-16T00:00:00Z"

# Publication type.
# Legend: 0 = Uncategorized; 1 = Conference paper; 2 = Journal article;
# 3 = Preprint / Working Paper; 4 = Report; 5 = Book; 6 = Book section;
# 7 = Thesis; 8 = Patent
publication_types: ["1"]

# Publication name and optional abbreviated publication name.
publication: In *NeurIPS Track Datasets and Benchmarks 2021 (NeurIPS 2021)*
publication_short: In *NeurIPS*

abstract: We introduce Argoverse 2 (AV2) — a collection of three datasets for perception and forecasting research in the self-driving domain. The annotated Sensor Dataset contains 1,000 sequences of multimodal data, encompassing high-resolution imagery from seven ring cameras, and two stereo cameras in addition to lidar point clouds, and 6-DOF map-aligned pose. Sequences contain 3D cuboid annotations for 26  object categories, all of which are sufficiently-sampled to support training and evaluation of 3D perception models. The Lidar Dataset contains 20,000 sequences of unlabeled lidar point clouds and map-aligned pose. This dataset is the largest  ever collection of lidar sensor data and supports self-supervised learning and the emerging task of point cloud forecasting. Finally, the Motion Forecasting Dataset contains 250,000 scenarios mined for interesting and challenging interactions between the autonomous vehicle and other actors in each local scene. Models are tasked with the prediction of future motion for “scored actors" in each scenario and are provided with track histories that capture object location, heading, velocity, and category. In all three datasets, each scenario contains its own HD Map with 3D lane and crosswalk geometry — sourced from data captured in six distinct cities. We believe these datasets will support new and existing machine learning research problems in ways that existing datasets do not. All datasets are released under the CC BY-NC-SA 4.0 license.

# Summary. An optional shortened abstract.
summary: "**NeurIPS Track Datasets and Benchmarks 2021**"

tags:
- Source Themes
featured: false

links:
#- name: Custom Link
#  url: http://example.org
url_pdf: https://datasets-benchmarks-proceedings.neurips.cc/paper/2021/file/4734ba6f3de83d861c3176a6273cac6d-Paper-round2.pdf
url_code: https://github.com/argoai/argoverse-api
url_dataset: https://www.argoverse.org/data.html
# url_poster: files/3DV2020-poster.pdf
url_project: https://www.argoverse.org/
#url_slides: ''
#url_source: '#'
# url_video: media/029-short.m4v

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder.
image:
  #caption: 'Image credit: [**Unsplash**](https://unsplash.com/photos/pLCdAaMFLTE)'
  focal_point: ""
  preview_only: true

# Associated Projects (optional).
#   Associate this publication with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `internal-project` references `content/project/internal-project/index.md`.
#   Otherwise, set `projects: []`.
projects: []

# Slides (optional).
#   Associate this publication with Markdown slides.
#   Simply enter your slide deck's filename without extension.
#   E.g. `slides: "example"` references `content/slides/example/index.md`.
#   Otherwise, set `slides: ""`.
slides: ""
---



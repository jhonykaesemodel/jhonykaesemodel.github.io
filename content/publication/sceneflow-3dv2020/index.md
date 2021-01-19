---
title: "Scene flow from point clouds with or without learning"
authors: ["[**Jhony K. Pontes**](https://www.jhonykaesemodel.com)", "[James Hays](https://www.cc.gatech.edu/~hays/)", "[Simon Lucey](http://www.cs.cmu.edu/~slucey/)"]
date: "2020-11-30T00:00:00Z"
doi: ""

# Schedule page publish date (NOT publication's date).
publishDate: "2020-11-30T00:00:00Z"

# Publication type.
# Legend: 0 = Uncategorized; 1 = Conference paper; 2 = Journal article;
# 3 = Preprint / Working Paper; 4 = Report; 5 = Book; 6 = Book section;
# 7 = Thesis; 8 = Patent
publication_types: ["1"]

# Publication name and optional abbreviated publication name.
publication: In *International Conference on 3D Vision (3DV 2020)* -- **Oral**
publication_short: In *3DV*

abstract: Scene flow is the three-dimensional (3D) motion field of a scene. It provides information about the spatial arrangement and rate of change of objects in dynamic environ- ments. Current learning-based approaches seek to estimate the scene flow directly from point clouds and have achieved state-of-the-art performance. However, supervised learn- ing methods are inherently domain specific and require a large amount of labeled data. Annotation of scene flow on real-world point clouds is expensive and challenging, and the lack of such datasets has recently sparked interest in self-supervised learning methods. How to accurately and robustly learn scene flow representations without labeled real-world data is still an open problem. Here we present a simple and interpretable objective function to recover the scene flow from point clouds. We use the graph Laplacian of a point cloud to regularize the scene flow to be “as- rigid-as-possible”. Our proposed objective function can be used with or without learning—as a self-supervisory signal to learn scene flow representations, or as a non-learning- based method in which the scene flow is optimized during runtime. Our approach outperforms related works in many datasets. We also show the immediate applications of our proposed method for two applications*:* motion segmentation and point cloud densification.

# Summary. An optional shortened abstract.
summary: " "

tags:
- Source Themes
featured: false

links:
#- name: Custom Link
#  url: http://example.org
url_pdf: https://arxiv.org/pdf/2011.00320.pdf
# url_code: 
#url_dataset: '#'
url_poster: files/3DV2020-poster.pdf
#url_project: ''
#url_slides: ''
#url_source: '#'
url_video: media/029-short.m4v

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

<img src="/media/teaser-3DV2020.png" alt="Drawing" style="width: 800px;"/>

<br/><br/>

### Short video presentation
<video width="100%" height="100%" controls>
  <source src="/media/029-short.m4v"
  type="video/mp4" />
  Your browser does not support the video tag.
</video>

<br/>

### Long video presentation
<video width="100%" height="100%" controls>
  <source src="/media/029-long.m4v"
  type="video/mp4" />
  Your browser does not support the video tag.
</video>

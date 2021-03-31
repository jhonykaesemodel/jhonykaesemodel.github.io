---
title: "Compact model representation for 3D reconstruction"
authors: ["[**Jhony K. Pontes**](https://www.jhonykaesemodel.com)", "[Chen Kong](http://www.cs.cmu.edu/~chenk/)", "[Anders Eriksson](http://aeriksson.net/)", "[Clinton Fookes](http://staff.qut.edu.au/staff/fookes/)", "[Sridha Sridharan](http://staff.qut.edu.au/staff/sridhara/)", "[Simon Lucey](https://ci2cv.net/)"]
date: "2017-10-23T00:00:00Z"
doi: "10.1109/3DV.2017.00020"

# Schedule page publish date (NOT publication's date).
publishDate: "2017-01-01T00:00:00Z"

# Publication type.
# Legend: 0 = Uncategorized; 1 = Conference paper; 2 = Journal article;
# 3 = Preprint / Working Paper; 4 = Report; 5 = Book; 6 = Book section;
# 7 = Thesis; 8 = Patent
publication_types: ["1"]

# Publication name and optional abbreviated publication name.
publication: In *International Conference on 3D Vision (3DV 2017)*
publication_short: In *3DV*

abstract: 3D reconstruction from 2D images is a central problem in computer vision. Recent works have been focusing on reconstruction directly from a single image. It is well known however that only one image cannot provide enough information for such a reconstruction. A prior knowledge that has been entertained are 3D CAD models due to its online ubiquity. A fundamental question is how to compactly represent millions of CAD models while allowing generalization to new unseen objects with fine-scaled geometry. We introduce an approach to compactly represent a 3D mesh. Our method first selects a 3D model from a graph structure by using a novel free-form deformation (FFD) 3D-2D registration, and then the selected 3D model is refined to best fit the image silhouette. We perform a comprehensive quantitative and qualitative analysis that demonstrates impressive dense and realistic 3D reconstruction from single images.

# Summary. An optional shortened abstract.
summary: "**3DV 2017**"

tags:
- Source Themes
featured: false

links:
#- name: Custom Link
#  url: http://example.org
url_pdf: https://eprints.qut.edu.au/112624/1/3DV2017_CameraReady.pdf
url_code: https://github.com/jhonykaesemodel/compact_3D_reconstruction
#url_dataset: '#'
url_poster: files/3DV2017-poster.pdf
# url_project: ''
# url_slides: ''
# url_source: https://ieeexplore.ieee.org/document/8374561
url_video: files/Supplementary_Material_3DV_2017.pptx

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder.
image:
  # caption: 'Image credit: [**Unsplash**](https://unsplash.com/photos/pLCdAaMFLTE)'
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

<img src="/media/compact-mesh.png" alt="Drawing" style="width: 800px;"/>
<img src="/media/3dv2017.gif" alt="Drawing" style="width: 600px;"/>
### Example of a 3D CAD model being fit to a single image using our FFD anchor registration and silhouette fitting.
<img src="/media/3DV_img1.png" alt="Drawing" style="width: 800px;"/>
<img src="/media/3dv2017_1.gif" alt="Drawing" style="width: 700px;"/>
<img src="/media/3DV_img2.png" alt="Drawing" style="width: 1200px;"/>


### Example of our 3D reconstruction from a single image.
<img src="/media/3DV_img3.png" alt="Drawing" style="width: 300px;"/>
<img src="/media/3DV_img4.png" alt="Drawing" style="width: 700px;"/>
<img src="/media/3dv2017_3.gif" alt="Drawing" style="width: 900px;"/>

[[1] C. Kong, C-H. Lin and S. Lucey, Using Locally Corresponding CAD Models for Dense 3D Reconstructions from a Single Image, CVPR 2017.](http://ci2cv.net/media/papers/chenkong_cvpr_2017.pdf)

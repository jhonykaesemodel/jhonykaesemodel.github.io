---
title: "PointNetLK revisited"
authors: ["[Xueqian Li](https://lilac-lee.github.io)", "[**Jhony K. Pontes**](https://www.jhonykaesemodel.com)", "[Simon Lucey](http://www.cs.cmu.edu/~slucey/)"]
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
publication: In *Conference on Computer Vision and Pattern Recognition (CVPR 2021)* -- **Oral**
publication_short: In *3DV*

abstract: We address the generalization ability of recent learning- based point cloud registration methods. Despite their success, these approaches tend to have poor performance when applied to mismatched conditions that are not well- represented in the training set, such as unseen object cat- egories, different complex scenes, or unknown depth sen- sors. In these circumstances, it has often been better to rely on classical non-learning methods (e.g., Iterative Clos- est Point), which have better generalization ability. Hybrid learning methods, that use learning for predicting point correspondences and then a deterministic step for alignment, have offered some respite, but are still limited in their generalization abilities. We revisit a recent innovation—PointNetLK—and show that the inclusion of an analytical Jacobian can exhibit remarkable generalization properties while reaping the inherent fidelity benefits of a learning framework. Our approach not only outperforms the state- of-the-art in mismatched conditions but also produces re- sults competitive with current learning methods when oper- ating on real-world test data close to the training set.

# Summary. An optional shortened abstract.
summary: " "

tags:
- Source Themes
featured: false

links:
#- name: Custom Link
#  url: http://example.org
url_pdf: https://arxiv.org/pdf/2008.09527.pdf
url_code: soon
#url_dataset: '#'
# url_poster: files/3DV2020-poster.pdf
#url_project: ''
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

<img src="/media/teaser-CVPR2021_1.png" alt="Drawing" style="width: 800px;"/>
Our analytical derivation of PointNetLK can be trained on a clean, dense, synthetic 3D object dataset and still accurately align noisy, sparse, real-world 3D scenes. Green is the template point cloud, purple is the registered point cloud, and the orange point clouds are an object training set. ξ are the rigid transforma- tion parameters inferred by our method.
<br/><br/>

<img src="/media/teaser-CVPR2021_2.png" alt="Drawing" style="width: 800px;"/>
Visual results on complex, real-world scenes. Our voxelized analytical PointNetLK is able to register complex, real-world scenes with high fidelity. These scenes are from 8 different testing categories of the 3DMatch dataset. Purple is the registered scene and green is the template.
<br/><br/>

### Short video presentation
coming soon
<!-- <video width="100%" height="100%" controls>
  <source src="/media/029-short.m4v"
  type="video/mp4" />
  Your browser does not support the video tag.
</video> -->

<br/>

### Long video presentation
coming soon
<!-- <video width="100%" height="100%" controls>
  <source src="/media/029-long.m4v"
  type="video/mp4" />
  Your browser does not support the video tag.
</video> -->

---
title: "Neural Prior for Trajectory Estimation"
authors: ["[Chaoyang Wang](https://mightychaos.github.io)", "[Xueqian Li](https://lilac-lee.github.io)", "[**Jhony K. Pontes**](https://www.jhonykaesemodel.com)", "[Simon Lucey](http://www.cs.cmu.edu/~slucey/)"]
date: "2022-06-28T00:00:00Z"
doi: ""

# Schedule page publish date (NOT publication's date).
publishDate: "2022-06-28T00:00:00Z"

# Publication type.
# Legend: 0 = Uncategorized; 1 = Conference paper; 2 = Journal article;
# 3 = Preprint / Working Paper; 4 = Report; 5 = Book; 6 = Book section;
# 7 = Thesis; 8 = Patent
publication_types: ["1"]

# Publication name and optional abbreviated publication name.
publication: In *Conference on Computer Vision and Pattern Recognition (CVPR 2022)*
publication_short: In *CVPR*

abstract: Neural priors are a promising direction to capture low-level vision statistics without relying on handcrafted regularizers. Recent works have successfully shown the use of neural architecture biases to implicitly regularize image denoising, super-resolution, inpainting, synthesis, scene flow, among others. They do not rely on large-scale datasets to capture prior statistics and thus generalize well to out-of-the-distribution data. Inspired by such advances, we investigate neural priors for trajectory representation. Traditionally, trajectories have been represented by a set of handcrafted bases that have limited expressibility. Here, we propose a neural trajectory prior to capture continuous spatio-temporal information without the need for offline data. We demonstrate how our proposed objective is optimized during runtime to estimate trajectories for two important tasks---Non-Rigid Structure from Motion (NRSfM) and lidar scene flow integration for self-driving scenes. Our results are competitive to many state-of-the-art methods for both tasks.

# Summary. An optional shortened abstract.
summary: "**CVPR 2022**"

tags:
- Source Themes
featured: false

links:
- name: Supplementary
  url: https://mightychaos.github.io/projects/cvpr22/supplementary/supp.html
#- name: Custom Link
#  url: http://example.org
url_pdf: https://openaccess.thecvf.com/content/CVPR2022/papers/Wang_Neural_Prior_for_Trajectory_Estimation_CVPR_2022_paper.pdf
# url_code: https://github.com/Lilac-Lee/Neural_Scene_Flow_Prior
#url_dataset: '#'
# url_poster: files/3DV2020-poster.pdf
#url_slides: ''
#url_source: '#'
# url_video: https://www.youtube.com/watch?v=WMcoLINtDYY&t=1s

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

<!-- Check https://mightychaos.github.io/projects/cvpr22/supplementary/supp.html -->

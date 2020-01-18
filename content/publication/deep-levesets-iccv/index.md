---
title: "Implicit surface representations as layers in neural networks"
authors: ["Mateusz Michalkiewicz", "[**Jhony K. Pontes**](https://www.jhonykaesemodel.com)", "[Dominic Jack](https://jackd.github.io/)", "[Mahsa Baktashmotlagh](https://researchers.uq.edu.au/researcher/23393)" ,"[Anders Eriksson](http://aeriksson.net/)"]
date: "2019-10-01T00:00:00Z"
doi: ""

# Schedule page publish date (NOT publication's date).
publishDate: "2017-01-01T00:00:00Z"

# Publication type.
# Legend: 0 = Uncategorized; 1 = Conference paper; 2 = Journal article;
# 3 = Preprint / Working Paper; 4 = Report; 5 = Book; 6 = Book section;
# 7 = Thesis; 8 = Patent
publication_types: ["1"]

# Publication name and optional abbreviated publication name.
publication: In *International Conference on Computer Vision (ICCV 2019)*
publication_short: In *ICCV*

abstract: Implicit shape representations, such as Level Sets, provide a very elegant formulation for performing computations involving curves and surfaces. However, including implicit representations into canonical Neural Network formulations is far from straightforward. This has consequently restricted existing approaches to shape inference, to significantly less effective representations, perhaps most commonly voxels occupancy maps or sparse point clouds. To overcome this limitation we propose a novel formulation that permits the use of implicit representations of curves and surfaces, of arbitrary topology, as individual layers in Neural Network architectures with end-to-end trainability. Specifically, we propose to represent the output as an oriented level set of a continuous and discretised embedding function. We investigate the benefits of our approach on the task of 3D shape prediction from a single image and demonstrate its ability to produce a more accurate reconstruction compared to voxel-based representations. We further show that our model is flexible and can be applied to a variety of shape inference problems.

# Summary. An optional shortened abstract.
summary: " "

tags:
- Source Themes
featured: false

links:
#- name: Custom Link
#  url: http://example.org
url_pdf: http://openaccess.thecvf.com/content_ICCV_2019/papers/Michalkiewicz_Implicit_Surface_Representations_As_Layers_in_Neural_Networks_ICCV_2019_paper.pdf
url_code: https://github.com/JeremyFisher/deep_level_sets
#url_dataset: '#'
#url_poster: '#'
#url_project: ''
#url_slides: ''
#url_source: '#'
#url_video: '#'

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

<img src="/media/deeplevelsets.jpg" alt="Drawing" style="width: 800px;"/>

### Results
<img src="/media/deeplevelsets_2.png" alt="Drawing" style="width: 1000px;"/>
<img src="/media/deeplevelsets_1.png" alt="Drawing" style="width: 1000px;"/>

---
title: "Two-stage facial age prediction using group-specific features"
authors: ["[**Jhony K. Pontes**](https://www.jhonykaesemodel.com)", "[Clinton Fookes](http://staff.qut.edu.au/staff/fookes/)", "[Alceu S. Britto Jr.](https://scholar.google.ca/citations?user=pRK8DCUAAAAJ&hl=en)", "[Alessandro L. Koerich](http://etsmtl.ca/Professeurs/akoerich/Home)"]
date: "2017-03-01T00:00:00Z"
doi: "10.1109/ICASSP.2017.7952622"

# Schedule page publish date (NOT publication's date).
publishDate: "2017-01-01T00:00:00Z"

# Publication type.
# Legend: 0 = Uncategorized; 1 = Conference paper; 2 = Journal article;
# 3 = Preprint / Working Paper; 4 = Report; 5 = Book; 6 = Book section;
# 7 = Thesis; 8 = Patent
publication_types: ["1"]

# Publication name and optional abbreviated publication name.
publication: In *International Conference on Acoustics, Speech and Signal Processing (ICASSP 2017)*
publication_short: In *ICASSP*

abstract: A novel two-stage age prediction approach with group-specific features is proposed in this paper. Aging process is captured through a highly discriminating feature representation that models shape, appearance, skin spots, and wrinkles. The two-stage method consists of a multi-class Support Vector Machine (SVM) to predict the age bracket while the final age prediction is carried out using Support Vector Regression (SVR). The novelty of our work is that the feature extraction is group-specific and can therefore be tailored to each age bracket in the specific age prediction step. The FG-NET Aging dataset was used to evaluate the proposed method and an impressive mean absolute error (MAE) of 3.98 was achieved. Our approach outperforms the current state-of-the-art while increasing the robustness to blur, expression and lighting variation with local phase features.

# Summary. An optional shortened abstract.
summary: " "

tags:
- Source Themes
featured: false

links:
#- name: Custom Link
#  url: http://example.org
url_pdf: https://eprints.qut.edu.au/104819/1/icassp2017-age-estimation.pdf
# url_dataset: '#'
url_poster: /files/icassp-poster.pdf
# url_project: ''
# url_slides: ''
# url_source: https://ieeexplore.ieee.org/document/7952622
# url_video: '#'

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

<img src="/media/age-estimation-icassp.png" alt="Drawing" style="width: 800px;"/>

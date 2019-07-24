---
title: "A flexible hierarchical approach for facial age estimation based on multiple features"
authors: ["[**Jhony K. Pontes**](https://www.jhonykaesemodel.com)", "[Alceu S. Britto Jr.](https://scholar.google.ca/citations?user=pRK8DCUAAAAJ&hl=en)", "[Clinton Fookes](http://staff.qut.edu.au/staff/fookes/)", "[Alessandro L. Koerich](http://etsmtl.ca/Professeurs/akoerich/Home)"]
date: "2016-06-01T00:00:00Z"
doi: "10.1016/j.patcog.2015.12.003"

# Schedule page publish date (NOT publication's date).
publishDate: "2017-01-01T00:00:00Z"

# Publication type.
# Legend: 0 = Uncategorized; 1 = Conference paper; 2 = Journal article;
# 3 = Preprint / Working Paper; 4 = Report; 5 = Book; 6 = Book section;
# 7 = Thesis; 8 = Patent
publication_types: ["2"]

# Publication name and optional abbreviated publication name.
publication: "*Pattern Recognition*"
publication_short: "PR"

abstract: Age estimation from facial images is increasingly receiving attention to solve age-based access control, age-adaptive targeted marketing, amongst other applications. Since even humans can be induced in error due to the complex biological processes involved, finding a robust method remains a research challenge today. In this work, we propose a new framework for the integration of Active Appearance Models (AAM), Local Binary Patterns (LBP), Gabor wavelets (GW) and Local Phase Quantization (LPQ) in order to obtain a highly discriminative feature representation which is able to model shape and appearance as well as wrinkles and skin spots. In addition, this work proposes a novel hierarchical age estimation approach consisting of a multi-class Support Vector Machine (SVM) to obtain the age group while the final age estimation is made using Support Vector Regression (SVR). The errors in the classification step, caused by the hard boundaries between age classes, are compensated in the detailed age estimation by overlapping flexibly the age ranges of each age function. The performance of the proposed approach was evaluated on FG-NET Aging and MORPH Album 2 datasets and a mean absolute error (MAE) of 4.50 and 5.86 years was achieved respectively. Furthermore, a combination of both datasets was evaluated to verify the robustness of the proposed framework and a MAE of 5.20 years was achieved. The proposed approach is competitive with current state-of-the-art and these results are achieved with an increased robustness to blur, lighting and expression variance through local phase features. We also compared the human age estimation to the proposed method and it has shown that the machine outperforms humans.

# Summary. An optional shortened abstract.
summary: ' '

tags:
- Source Themes
featured: false

# links:
# - name: ""
#   url: ""
url_pdf: https://eprints.qut.edu.au/92300/1/manuscript_Jhony.pdf
# url_code: ''
# url_dataset: ''
# url_poster: ''
# url_project: ''
# url_slides: ''
# url_source: ''
# url_video: ''

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder.
image:
  # caption: 'Image credit: [**Unsplash**](https://unsplash.com/photos/jdD8gXaTZsc)'
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


<img src="/media/age-estimation-pr.png" alt="Drawing" style="width: 800px;"/>

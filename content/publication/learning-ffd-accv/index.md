---
title: "Learning free-form deformations for 3D object reconstruction"
authors: ["[Dominic Jack](https://jackd.github.io/)", "[**Jhony K. Pontes**](https://www.jhonykaesemodel.com)", "[Sridha Sridharan](http://staff.qut.edu.au/staff/sridhara/)", "[Clinton Fookes](http://staff.qut.edu.au/staff/fookes/)", "[Sareh Shirazi](https://scholar.google.com.au/citations?user=svw1CgUAAAAJ&hl=en)", "[Frederic Maire](https://scholar.google.com.au/citations?user=YUzVddsAAAAJ&hl=en)", "[Anders Eriksson](http://aeriksson.net/)"]
date: "2018-11-01T00:00:00Z"
doi: "10.1007/978-3-030-20890-5_21"

# Schedule page publish date (NOT publication's date).
publishDate: "2017-01-01T00:00:00Z"

# Publication type.
# Legend: 0 = Uncategorized; 1 = Conference paper; 2 = Journal article;
# 3 = Preprint / Working Paper; 4 = Report; 5 = Book; 6 = Book section;
# 7 = Thesis; 8 = Patent
publication_types: ["1"]

# Publication name and optional abbreviated publication name.
publication: In *Asian Conference on Computer Vision (ACCV 2018)*
publication_short: In *ACCV*

abstract: Representing 3D shape in deep learning frameworks in an accurate, efficient and compact manner still remains an open challenge. Most existing work addresses this issue by employing voxel-based representations. While these approaches benefit greatly from advances in computer vision by generalizing 2D convolutions to the 3D setting, they also have several considerable drawbacks. The computational complexity of voxel-encodings grows cubically with the resolution thus limiting such representations to low-resolution 3D reconstruction. In an attempt to solve this problem, point cloud representations have been proposed. Although point clouds are more efficient than voxel representations as they only cover surfaces rather than volumes, they do not encode detailed geometric information about relationships between points. In this paper we propose a method to learn free-form deformations (FFD) for the task of 3D reconstruction from a single image. By learning to deform points sampled from a high-quality mesh, our trained model can be used to produce arbitrarily dense point clouds or meshes with fine-grained geometry. We evaluate our proposed framework on synthetic data and achieve state-of-the-art results on surface and volumetric metrics.

# Summary. An optional shortened abstract.
summary: " "

tags:
- Source Themes
featured: false

links:
#- name: Custom Link
#  url: http://example.org
url_pdf: https://eprints.qut.edu.au/123318/1/learning_ffd_for_object_reconstruction.PDF
url_code: https://github.com/jackd/template_ffd
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

<img src="/media/learning_ffd.png" alt="Drawing" style="width: 700px;"/>

### Overview
Given a single image, our method uses a CNN to infer free-form deformation (FFD) parameters $\Delta \mathbf{P}$ (red arrows) for multiple templates $T$ (middle meshes). The $\Delta \mathbf{P}$ parameters are then used to deform the template vertices to infer a 3D mesh for each template (right meshes). Trained only with surface-sampled point-clouds, the model learns to apply large deformations to topologically different templates to produce inferred meshes with similar surfaces. Likelihood weightings $\gamma$ are also inferred by the network but not shown for simplicity. FC stands for fully connected layer.

### Results
Representative results for different categories. Column (a) shows the input image. Column (b) shows the selected template model. Column (c ) shows the deformed point cloud by FFD. The deformed voxelized model is shown in column (d). Column (e) shows our final 3D mesh reconstruction, and the ground truth is shown in column (f).

<img src="/media/learning_ffd_titles.png" alt="Drawing" style="width: 880px;"/>
<img src="/media/learning_ffd_bigplot.png" alt="Drawing" style="width: 1000px;"/>


### Transferring 3D semantic labels
Good (left block) and bad (right block) examples from the chair and plane categories. For each block: Input image; selected template's semantically segmented cloud; deformed segmented cloud; deformed mesh.

<img src="/media/learning_ffd_semantics.png" alt="Drawing" style="width: 1200px;"/>

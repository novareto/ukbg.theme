from setuptools import setup, find_packages
import os

version = '1.0'

setup(name='ukbg.theme',
      version=version,
      description="Siguv, BGHW and BGETEM Theme",
      long_description=open("README.txt").read() + "\n" +
                       open(os.path.join("docs", "HISTORY.txt")).read(),
      # Get more strings from
      # http://pypi.python.org/pypi?:action=list_classifiers
      classifiers=[
        "Framework :: Plone",
        "Programming Language :: Python",
        ],
      keywords='',
      author='S.Trabucchi',
      author_email='st@abstract-technology.de',
      url='http://svn.plone.org/svn/collective/',
      license='GPL',
      packages=find_packages(exclude=['ez_setup']),
      namespace_packages=['ukbg'],
      include_package_data=True,
      zip_safe=False,
      install_requires=[
          'setuptools',
          # -*- Extra requirements: -*-
          'z3c.jbot',
          'diazo<1.1.0',
          'plone.app.theming',
          'experimental.cssselect',
          'cssselect',

      ],
      entry_points="""
      # -*- Entry points: -*-

      [z3c.autoinclude.plugin]
      target = plone
      """,
      )

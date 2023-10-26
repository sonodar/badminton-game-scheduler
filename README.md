# バドミントンダブルスメンバー決めるくん

バドミントンサークルなどでコートのメンバーをランダムにアサインするためのツールです。  
なるべく似通った組み合わせが連続しないように工夫しています。

## アルゴリズム

- 履歴がない場合（最初の1回目）は完全にランダム。
- ランダム選出を何度か繰り返し、その中から似通った履歴がないものを選出します。かつ、各メンバーのプレイ回数がなるべく平準化されるようにします。
  - 繰り返す回数は現在のメンバー数によって異なります（チューニング予定）。
  - 履歴と似通っているかどうかの判定は編集距離を用います。コートとコートに入るメンバーは二次元の数値配列です。二次元配列の編集距離は以下のように求めます。
    - コートメンバーの配列は順序が異なっても同じとして扱うため、まず二次元配列を一定の規則に従ってソートします。
    - 二次元配列を flat で一次元配列に変換して、動的計画法により編集距離を求めます。
  - 各メンバーのプレイ回数を平準化するために以下の方法で複数のランダム選出された配列の中からもっとも平準化されそうなものを選びます。
    - 各プレイヤーのプレイ回数の、最大値と最小値の差が一番小さいものを選出します。
    - 最大値と最小値の差が同値のものは、各プレイヤーのプレイ回数の標準偏差がもっとも小さいものを選出します。
- このアルゴリズムは、履歴やメンバー数が多くなると指数関数的に計算量が増えます。履歴数が少ない（そんなに何度も試合できない）ことを前提としています。

> このアルゴリズムは暫定です。もっと良いアルゴリズムがあるかもしれないので（コントリビュート歓迎）。

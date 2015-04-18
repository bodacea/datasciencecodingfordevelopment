from sklearn import cluster, datasets

iris = datasets.load_iris()

k_means = cluster.KMeans(3)
k_means.fit(iris.data) 

print("Generated labels: {}".format(k_means.labels_))

print("Real labels: {}".format(iris.target))
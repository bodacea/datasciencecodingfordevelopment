import numpy as np
from sklearn import datasets
from sklearn.neighbors import KNeighborsClassifier

#Get the iris dataset
iris = datasets.load_iris()
iris_X = iris.data
iris_Y = iris.target

#Look at the dataset
print("Iris dataset: {}".format(iris))
#iris.viewkeys() gives all the keys for this dataset
print("Xs: {}".format(iris_X))
print("Ys: {}".format(iris_Y))
print("Unique Y values: {}".format(np.unique(iris_Y)))

#Split into 140 training rows and 10 test rows
ntest=10
np.random.seed(0)
indices = np.random.permutation(len(iris_X))
iris_X_train = iris_X[indices[:-ntest]]
iris_Y_train = iris_Y[indices[:-ntest]]
iris_X_test  = iris_X[indices[-ntest:]]
iris_Y_test  = iris_Y[indices[-ntest:]]
print("You have {} training points and {} test points".format(len(iris_X_train), 
	len(iris_X_test)))

knn = KNeighborsClassifier()
knn.fit(iris_X_train, iris_Y_train)
predicted_classes = knn.predict(iris_X_test)
print("kNN predicted classes: {}".format(predicted_classes))
print("Real classes: {}".format(iris_Y_test))

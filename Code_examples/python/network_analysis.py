#!/usr/bin/env python
""" Network visualisation from Python


Sara-Jayne Terp
2015
"""
import networkx as nx
import matplotlib.pyplot as plt
import numpy as np
import operator


"""
Create NetworkX undirected or directed graph for processing
"""
def create_graph(edgelist, directed=False):
    if directed:
        G = nx.DiGraph()
    else:
        G = nx.Graph()
    for edge in edgelist:
        G.add_edge(edge[0], edge[1])
    return(G)



"""
Code from https://www.udacity.com/wiki/creating-network-graphs-with-python
"""
def draw_graph(graph, labels=None, graph_layout='shell',
               node_size=1600, node_color='blue', node_alpha=0.3,
               node_text_size=12,
               edge_color='blue', edge_alpha=0.3, edge_tickness=1,
               edge_text_pos=0.3,
               text_font='sans-serif'):

    # create networkx graph
    G=nx.Graph()

    # add edges
    for edge in graph:
        G.add_edge(edge[0], edge[1])

    # these are different layouts for the network you may try
    # shell seems to work best
    if graph_layout == 'spring':
        graph_pos=nx.spring_layout(G)
    elif graph_layout == 'spectral':
        graph_pos=nx.spectral_layout(G)
    elif graph_layout == 'random':
        graph_pos=nx.random_layout(G)
    else:
        graph_pos=nx.shell_layout(G)

    # draw graph
    nx.draw_networkx_nodes(G,graph_pos,node_size=node_size, 
                           alpha=node_alpha, node_color=node_color)
    nx.draw_networkx_edges(G,graph_pos,width=edge_tickness,
                           alpha=edge_alpha,edge_color=edge_color)
    nx.draw_networkx_labels(G, graph_pos,font_size=node_text_size,
                            font_family=text_font)

    if labels is None:
        labels = range(len(graph))

    edge_labels = dict(zip(graph, labels))
    nx.draw_networkx_edge_labels(G, graph_pos, edge_labels=edge_labels, 
                                 label_pos=edge_text_pos)

    # show graph
    plt.show()
    return()


""" Also from udacity
"""
def test_draw_graph():
	graph = [(0, 1), (1, 5), (1, 7), (4, 5), (4, 8), (1, 6), (3, 7), (5, 9),
	         (2, 4), (0, 4), (2, 5), (3, 6), (8, 9)]

	# you may name your edge labels
	labels = map(chr, range(65, 65+len(graph)))
	#draw_graph(graph, labels)

	# if edge labels is not specified, numeric labels (0, 1, 2...) will be used
	draw_graph(graph)
	return()


""" Create networkx view of graph
"""
def simple_graph_view(G):
	graph_pos = nx.spring_layout(G)
	nx.draw_networkx_nodes(G, graph_pos, node_size=1600, alpha=0.3, node_color='blue')
	nx.draw_networkx_edges(G, graph_pos, width=1, alpha=0.3, edge_color='blue')
	nx.draw_networkx_labels(G, graph_pos, font_size=12, font_family='sans-serif')
	plt.show()
    return()


""" Create alternative graph representations
"""
def create_alternative_graph_representations(edgelist):

    #Just for fun, generate adjacency matrix and adjacency list
    adjmatrix = np.zeros(shape=(10,10))
    for edge in edgelist:
        adjmatrix[edge[0], edge[1]] = 1
        adjmatrix[edge[1], edge[0]] = 1 #assume that graph is undirected
    adjlist = {}

    for edge in edgelist:
        adjlist.setdefault(edge[0], set([]))
        adjlist.setdefault(edge[1], set([]))
        adjlist[edge[0]].add(edge[1])
        adjlist[edge[1]].add(edge[0])
    for adj in adjlist:
        adjlist[adj] = list(adjlist[adj])

    return(adjmatrix, adjlist)


#Edge list
#edgelist = {('A','C'):0.5,('C','A'):0.5,('B','C'):0.1,('C','B'):0.1,
#            ('D','C'):0.9,('C','E'):0.8,('E','F'):1.0,('F','G'):0.9,('G','E'):0.6}
edgelist = {(0,1):'A',(1,5):'B',(1,7):'C',(4,5):'D',(4,8):'E',(1,6):'F',(3,7):'G', 
		 (5,9):'H',(2,4):'I',(0,4):'J',(2,5):'K',(3,6):'L',(8,9):'M'}
# kite_edgelist = {(a,b),(a,c),(a,d),(b,d),(b,e),(b,g),(c,d),(c,f),(d,e),(d,f),(d,g),(e,g),(f,g),(f,h),(g,h),(h,i),(i,j)}
# kite_edgelist = {("a","b"):0.5,("a","c"):0.4,("a","d"):0.7,("b","d"):0.4,("b","e"):0.9,
# ("b","g"):0.2,("c","d"):0.5,("c","f"):0.3,("d","e"):0.8,("d","f"):0.7,("d","g"):0.9,
# ("e","g"):0.2,("f","g"):0.3,("f","h"):0.1,("g","h"):0.9,("h","i"):0.8,("i","j"):0.7}
#Kite edgelist
edgelist = {
(0,1),(0,2),(0,3),(0,5),(0,9),
(1,3),(1,4),(1,6),(1,9),
(2,3),(2,5),
(3,4),(3,5),(3,6),
(4,6),
(5,6),
(7,8),
(8,9)}


#simple_graph_view(edgelist)
G = create_graph(edgelist)

#Try out some network analysis routines 
#from http://networkx.lanl.gov/reference/algorithms.centrality.html
#nx.in_degree_centrality(G) #only directed graphs
#nx.out_degree_centrality(G) #only directed graphs
cent = {}
cent["degree"]      = nx.degree_centrality(G)
cent["closeness"]   = nx.closeness_centrality(G)
cent["betweenness"] = nx.betweenness_centrality(G)
cent["eigenvector"] = nx.eigenvector_centrality(G) #doesn't always converge

for c in cent:
    print(c)
    x = sorted(cent[c].items(), key=operator.itemgetter(1), reverse=True)
    for i,ci in enumerate(x): 
        print("{} {}".format(i,ci))

#Get cliques
print("K-cores:")
for csize in range(9,2,-1):
    for i,c in enumerate(nx.k_clique_communities(G, csize)):
        print("{}: {}".format(csize-1,c))





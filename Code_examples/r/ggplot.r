library(ggplot2)

refugees = c(23,175,15543,11,338796,1244,63,53)
asylumseekers = c(140,77,2872,6,255,91,6,7)
origins = c('Burundi','Dem. Rep. of the Congo', 'Eritrea', 'Rwanda', 'Somalia','South Sudan','Sudan','Uganda')
countries <- factor(origins)

print(qplot(refugees, asylumseekers, color = countries))

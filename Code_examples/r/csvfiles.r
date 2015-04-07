print("---All files in directory---")
print(list.files())

print("---Refugee data---")
refugees <- read.csv('../data/popstats_clean.csv')
print(str(refugees))

print("---Population data---")
population <- read.table('../data/sp_pop.tsv', sep='\t', header=TRUE)
print(str(population))

print("---Merged data---")
popdata <- merge(x = refugees, y = population, by.x='Country.of.origin', by.y='Country.Name')
print(str(popdata))
print(cor.test(popdata$Asylum.seekers, popdata$X2013.Population))

plot(popdata$Asylum.seekers, popdata$X2013.Population)
line <- lm(popdata$X2013.Population ~ popdata$Asylum.seekers)
abline(line)

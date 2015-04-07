b <- c(1,3,7,5,3,2)
names(b) <- c('jan','feb','mar','apr','may','jun')
barplot(b)
abline(h=mean(b))

User : {
    username
    email
    displayName
    password
    createdAt
    updatedAt
    collections: [[ {
        collectionId
        name
        plans : [[ {
            planName
            planExercises
            planId
        } 
    }
    exercises : [[ {
        databaseId,
        collections : [[ {
            colectionId :
            plans : [[ {
                    planId
                    data
            }
        }
        previousReps : [[ {
            reps
            whichCollection
            whichPlan
            addedAt
        }
        maxWeightAndSets : {
            weight,
            reps,
            unit,
            updatedAt
        }
        archived : boolean
    }
}
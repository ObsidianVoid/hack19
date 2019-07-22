var files = 
[
    {
        Id: 1,
        Name: "file1",
        FileRecommendations: [
            {
                Id: 2,
                Name: "file2",
            }
        ],
        ContributorRecommendations: [
            {
                Id: 1,
                Name: "Anirudh"
            }
        ]
    },
    {
        Id: 2,
        Name: "file2",
        FileRecommendations: [
            {
                Id: 1,
                Name: "file1",
            },
            {
                Id: 3,
                Name: "file3",
            }
        ],
    }
];

var contributors = 
[
    {
        Id: 1,
        Name: "Anirudh"
    },
    {
        Id: 2,
        Name: "Priyanka"
    }
]

const resolvers = {
    Query: {
        file(parent, args) {
            return files.find(file => file.Id == args.id);
        }
    }
}

export default resolvers;
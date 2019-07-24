const files = 
[
    {
        id: 1,
        name: "file1",
        FileRecommendations: [
            {
                id: 2,
                name: "file2",
            }
        ],
        ContributorRecommendations: [
            {
                id: 1,
                name: "Anirudh"
            }
        ]
    },
    {
        id: 2,
        name: "file2",
        FileRecommendations: [
            {
                id: 1,
                name: "file1",
            },
            {
                id: 3,
                name: "file3",
            }
        ],
    }
];

module.exports.files=files;
using System;
using Microsoft.VisualStudio.Services.Common;
using Microsoft.VisualStudio.Services.Client;
using Microsoft.TeamFoundation.SourceControl.WebApi;
using Microsoft.VisualStudio.Services.WebApi;
using System.Collections.Generic;
using System.Linq;

namespace Contracts
{
    class File
    {
        public File(string path, string name)
        {
            this.path = path;
            this.name = name;
        }

        public string path
        {
            get;
            set;
        }

        public string name
        {
            get;
            set;
        }
    }

    class FileInput
    {
        public FileInput(string path, string url)
        {
            this.Path = path;
            this.Url = url;
        }

        public string Path
        {
            get;
            set;
        }

        public string Url
        {
            get;
            set;
        }
    }
}

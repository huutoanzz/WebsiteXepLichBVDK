using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace BVĐK_API.Interfaces
{
    public interface IBackupRestoreRepository
    {
        Task BackupDataAsync(string outputPath);
        Task RestoreDataAsync(IFormFile file);
    }
}

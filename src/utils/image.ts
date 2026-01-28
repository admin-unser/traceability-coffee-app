export const imageUtils = {
  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  async captureFromCamera(): Promise<string | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment'; // カメラを優先
      
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          try {
            const base64 = await this.fileToBase64(file);
            resolve(base64);
          } catch (error) {
            console.error('Failed to convert image:', error);
            resolve(null);
          }
        } else {
          resolve(null);
        }
      };
      
      input.click();
    });
  },

  async selectFromGallery(): Promise<string | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      // capture属性なしで、ギャラリーから選択
      
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          try {
            const base64 = await this.fileToBase64(file);
            resolve(base64);
          } catch (error) {
            console.error('Failed to convert image:', error);
            resolve(null);
          }
        } else {
          resolve(null);
        }
      };
      
      input.click();
    });
  },
};


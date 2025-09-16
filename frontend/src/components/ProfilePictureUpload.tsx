import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProfilePictureUploadProps {
  currentImage?: string;
  name: string;
  onImageUpdate: (imageUrl: string | null) => void;
}

export function ProfilePictureUpload({ currentImage, name, onImageUpdate }: ProfilePictureUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // In a real app, you would upload to a server
      // For now, we'll create a local URL
      const imageUrl = URL.createObjectURL(file);
      onImageUpdate(imageUrl);
      
      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been successfully updated",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload profile picture. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemovePicture = () => {
    onImageUpdate(null);
    toast({
      title: "Profile picture removed",
      description: "Profile picture has been removed",
    });
  };

  return (
    <Card className="shadow-soft">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="w-32 h-32">
              <AvatarImage src={currentImage} alt={`${name}'s profile`} />
              <AvatarFallback className="text-2xl bg-gradient-primary text-white">
                {name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            {currentImage && (
              <Button
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 rounded-full w-8 h-8 p-0"
                onClick={handleRemovePicture}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="text-center">
            <h3 className="font-semibold text-foreground">{name}</h3>
            <p className="text-sm text-muted-foreground">Profile Picture</p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleUploadClick}
              disabled={isUploading}
              className="gap-2"
            >
              {isUploading ? (
                <>
                  <Upload className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4" />
                  {currentImage ? 'Change' : 'Upload'}
                </>
              )}
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="text-xs text-muted-foreground text-center">
            <p>Supported formats: JPG, PNG, GIF</p>
            <p>Maximum size: 5MB</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
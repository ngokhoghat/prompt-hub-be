import { IsNotEmpty } from "class-validator";
import { IsBefore, IsTimeFormat } from "src/config/_validation";

export class SliceAudioFileDto {
    @IsNotEmpty()
    fileId: string;

    @IsNotEmpty()
    @IsTimeFormat({ message: 'Start time must be in the format "hh:mm:ss"' })
    @IsBefore('endTime', { message: 'startTime must be after endTime' })
    startTime: string;

    @IsNotEmpty()
    @IsTimeFormat({ message: 'End time must be in the format "hh:mm:ss"' })
    endTime: string;
}

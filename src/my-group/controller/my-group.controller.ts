import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MyGroupService } from '../service/my-group.service';
import {
  MyGroupCreate,
  MyGroupDetail,
  MyGroupDoneAndAllCnt,
  MyGroupRequest,
  MyGroupSimple,
} from '../dto/my.group.dto';
import { ResponseEntity } from '../../common/response/response.entity';
import {
  DONE_MY_GROUP_OK,
  MY_GROUP_CREATE_OK,
  MY_GROUP_DELETE_OK,
  MY_GROUP_DETAIL_OK,
  MY_GROUP_OK,
  MY_GROUP_STATUS_OK,
} from '../../common/response/content/message.my-group';
import { ResponseMessage } from '../../common/response/response.message';
import { TransactionInterceptor } from '../../common/interceptors/transaction.interceptor';
import { EntityManager } from '../../common/decorators/entity.manager.decorator';

@Controller('/api/v1/my-group')
export class MyGroupController {
  constructor(private readonly myGroupService: MyGroupService) {}

  @Get('/detail')
  public async getMyGroupDetail(
    @Query('myGroupId') myGroupId: number,
  ): Promise<ResponseEntity<MyGroupDetail>> {
    return ResponseEntity.OK_WITH(
      new ResponseMessage(HttpStatus.OK, MY_GROUP_DETAIL_OK),
      await this.myGroupService.getMyGroupDetail(myGroupId),
    );
  }

  @Delete('')
  // Todo -> UseGuard(...)
  public async deleteMyGroup(
    @Query('myGroupId') myGroupId: number,
    @Query('userId') userId: number,
  ): Promise<ResponseMessage> {
    await this.myGroupService.deleteMyGroup(myGroupId, userId);
    return ResponseEntity.OK(MY_GROUP_DELETE_OK);
  }

  @Get('/day/status')
  // Todo -> UseGuard(...)
  public async getMyGroupDoneStatus(
    @Query('userId') userId: number,
  ): Promise<ResponseEntity<MyGroupDoneAndAllCnt>> {
    return ResponseEntity.OK_WITH(
      new ResponseMessage(HttpStatus.OK, MY_GROUP_STATUS_OK),
      await this.myGroupService.getMyGroupDoneStatus(userId),
    );
  }

  @Post('/done')
  // Todo -> UseGuard(...)
  // Todo Refactoring Save File
  @UseInterceptors(FileInterceptor('file'), TransactionInterceptor)
  public async doneDayMyGroup(
    @Query() id: number[],
    @UploadedFile() file: Express.Multer.File,
    @EntityManager() manager,
  ) {
    await this.myGroupService.doneDayMyGroup(
      id['myGroupId'],
      id['userId'],
      file,
      manager,
    );
    return ResponseEntity.OK(DONE_MY_GROUP_OK);
  }

  @Post('/')
  @UseInterceptors(TransactionInterceptor)
  // Todo -> UseGuard(...)
  public async createMyGroup(
    @Body() req: MyGroupRequest,
    @EntityManager() manager,
  ): Promise<ResponseEntity<MyGroupCreate>> {
    return ResponseEntity.OK_WITH(
      new ResponseMessage(HttpStatus.OK, MY_GROUP_CREATE_OK),
      await this.myGroupService.createMyGroup(req, manager),
    );
  }

  @Get('/all')
  // Todo -> UseGuard(...)
  public async getMyGroupList(
    @Query() query,
  ): Promise<ResponseEntity<MyGroupSimple[]>> {
    return ResponseEntity.OK_WITH(
      new ResponseMessage(HttpStatus.OK, MY_GROUP_OK),
      await this.myGroupService.getMyGroupList(query.active, query.userId),
    );
  }
}
